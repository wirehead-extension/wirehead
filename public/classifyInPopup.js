function hello() {
  console.log('hello world')
}
window.onload = function() {
  var btn = document.getElementById('test')
  btn.onclick = hello
}
