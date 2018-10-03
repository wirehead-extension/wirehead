import db from '../db'

export function updateBayesModel(bayesModel) {
  db.transaction('rw', db.bayesModel, function*() {
    yield db.bayesModel.delete('bayesModel')
    yield db.bayesModel.add({bayesModel: bayesModel})
  })
}

export function getBayesModel() {
  db.transaction('rw', db.bayesModel, function*() {
    const model = yield db.bayesModel.get(1)
    console.log('model', model)
    return model
  })
}

//CODE FOR TESTING
// const workDocuments = [
//   'coding github version history api',
//   'vr fullstack blockchain'
// ]
// const playDocuments = [
//   'video games fortnite Youtube meme',
//   'facebook minecraft compilation'
// ]
// classifier.addDocuments(workDocuments, 'work')
// classifier.addDocuments(playDocuments, 'play')
// classifier.train()

// updateBayesModel(JSON.stringify(classifier))
// console.log('getBayesModel', getBayesModel())
