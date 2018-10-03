import db from './db'

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
