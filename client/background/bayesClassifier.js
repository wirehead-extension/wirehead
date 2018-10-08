import BayesClassifier from 'bayes-classifier'
import db from '../db'

//Make a new model from all the training data we have (computationally expensive!)
export async function updateBayesModel() {
  let workDocuments = []
  let playDocuments = []
  //Separate all of the training data on the database into work and play docs
  await db.transaction('rw', db.trainingData, function*() {
    const trainingData = yield db.trainingData.toArray()
    trainingData.forEach(datum => {
      if (datum.label === 'work') {
        workDocuments.push(datum.document)
      } else {
        playDocuments.push(datum.document)
      }
    })
  })
  //Retrain the model (if we have both some work and some play documents)
  if (workDocuments.length > 0 && playDocuments.length > 0) {
    const classifier = new BayesClassifier()
    classifier.addDocuments(workDocuments, 'work')
    classifier.addDocuments(playDocuments, 'play')
    classifier.train()

    //Replace old model with new model
    db.transaction('rw', db.bayesModel, function*() {
      yield db.bayesModel.put({id: 0, model: JSON.stringify(classifier)})
    })
  }
}

//Get a trained model that we made earlier (not so computationally expensive)
export async function getBayesModel() {
  let model
  await db.transaction('rw', db.bayesModel, function*() {
    model = yield db.bayesModel.get(0)
  })
  //This is causing an error
  if (model) {
    return model.model
  } else {
    return false
  }
}

// given a document, returns either "work" or "play"
export async function classifyDocument(document) {
  const model = await getBayesModel()
  const classifier = new BayesClassifier()
  classifier.restore(JSON.parse(model))
  return classifier.classify(document)
}

// Given a document, returns the relative probabilities of work or play
//In this format: [{label: "play", value: 0.013}{label: "work", value: 0.026}]
export async function getClassifications(document) {
  const model = await getBayesModel()
  const classifier = new BayesClassifier()
  classifier.restore(JSON.parse(model))
  return classifier.getClassifications(document)
}

//We need to know how many training examples there are
//in order to know how often to call updateBayesModel
export async function getNumberOfTrainingExamples() {
  let count
  await db.transaction('rw', db.trainingData, function*() {
    count = yield db.trainingData.count()
  })
  return count
}

//Delete 100 old db entries whenever we reach 10,000 training examples
export async function deleteOldTrainingData() {
  let dataOrderedByTime
  await db.transaction('rw', db.trainingData, function*() {
    dataOrderedByTime = yield db.trainingData.orderBy('time').toArray()
  })
  const idsToDelete = dataOrderedByTime.slice(0, 100).map(datum => datum.id)
  await db.transaction('rw', db.trainingData, function*() {
    yield db.trainingData.bulkDelete(idsToDelete)
  })
}

//If the bayes model exists, this returns document's classification
//If it doesn't exist, it returns "uncategorized"
export async function classifyDocumentIfBayesModel(document) {
  const model = await getBayesModel()
  return model ? classifyDocument(document) : 'uncategorized'
}
