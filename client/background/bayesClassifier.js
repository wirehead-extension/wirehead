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
  return model.model
}

// given a document, returns either "work" or "play"
export async function classifyDocument(document) {
  const model = await getBayesModel()
  const classifier = new BayesClassifier()
  classifier.restore(JSON.parse(model))
  return classifier.classify(document)
}

// given a document, returns the relative probabilities of work or play
//(not sure if we'll need this)
export async function getClassifications(document) {
  const model = await getBayesModel()
  const classifier = new BayesClassifier()
  classifier.restore(JSON.parse(model))
  console.log('hi', classifier.getClassifications(document))
  return classifier.getClassifications(document)
}
