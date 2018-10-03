import React from 'react'

import {Navbar} from './components'
import Routes from './routes'
//Test of naive bayes
// const BayesClassifier = require('bayes-classifier')
// var classifier = new BayesClassifier()

// const workDocuments = ['work github remote api', 'vr cryptocurrency networking']
// const playDocuments = [
//   'video games fortnite Youtube meme',
//   'facebook minecraft compilation'
// ]
// classifier.addDocuments(workDocuments, 'work')
// classifier.addDocuments(playDocuments, 'play')
// classifier.train()

// // console.log(classifier.classify('vr blockchain cryptocurrency github'))
// // console.log(classifier.getClassifications('facebook meme page'))

// let db
// let wireheadModel
// const request = window.indexedDB.open('wirehead', 3)
// console.log('request', request)
// request.onerror = function(err) {
//   console.error(err)
// }

// request.onsuccess = function(event) {
//   console.log('request.onsuccess is happening')
//   db = event.target.result
//   if (db.objectStoreNames.model) {
//     wireheadModel = db.objectStoreNames.model
//     // request.onupgradeneeded(event);
//   }
//   console.log('db', db)
// }

// //I don't think this is gonna run
// request.onupgradeneeded = function(event) {
//   db = event.target.result
//   wireheadModel = db.createObjectStore('model', {autoIncrement: true})
//   //history.createIndex("url", "url", { unique: false });
//   //history.createIndex("start", "start", { unique: false });
//   /* history.transaction.oncomplete = function(event) {
//     var historyWrite = db
//       .transaction("history", "readwrite")
//       .objectStore("history");
//     historyWrite.add({ url: "a", start: 1 });
//   };*/
// }

// //We're good up to this point it seems
// console.log('are we making it this far?')
// var transaction = db.transaction(['model'], 'readwrite')
// console.log('transaction', transaction)
// transaction.oncomplete = function(event) {
//   console.log('transaction complete')
// }
// transaction.onerror = function(event) {
//   console.error(event)
// }
// var objectStore = transaction.objectStore('model')
// objectStore.add({model: 'model here'})
// console.log('objectStore', objectStore)

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
