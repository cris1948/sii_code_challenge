let Search = {
  listenerAction (text) {
    console.log(text, this)
  }
};

window.onload = function () {
  let searchInput = document.getElementById('search');

  searchInput.addEventListener('input', (evt) => {
    _.delay((evt) => {
      Search.listenerAction(evt.target.value)
    }, 1000, evt)
  })
};


