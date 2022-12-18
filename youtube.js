// AIzaSyAbNv9-Nw8GpgalzmUtCs6kN08UtkRpJ5s

const searchField = document.querySelector('#query');
const icon = document.querySelector('#search-btn');
const searchForm = document.querySelector('#searchForm');
const results = document.querySelector('#results');
const btnGroup = document.querySelector('#buttons');


function search() {
  //clear
  results.innerHTML = '';
  btnGroup.innerHTML = '';
  let query = searchField.value;
  callAPI(query);
};

function callAPI(query, token) {
  let dataObject = { part: 'snippet, id', q: query, type: 'video', key: 'AIzaSyAbNv9-Nw8GpgalzmUtCs6kN08UtkRpJ5s' }

  if (token)
    dataObject.pageToken = token;

  $.ajax({
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: dataObject,
    type: 'GET',
    dataType: 'jsonp',
    success: function (data) {
      // console.log('in success');
      let nextPageToken = data.nextPageToken;
      let prevPageToken = data.prevPageToken;

      data.items.forEach(function (item) {
        //Get output from a function
        let output = getOutput(item);
        //Display Results
        results.innerHTML += output;
      });
      let buttons = getButtons(prevPageToken, nextPageToken, query);
      //display buttons
      btnGroup.innerHTML = buttons;
    },
    error: function (jqXHR, textStatus, ex) {
      console.log(`${textStatus}, ${ex}, ${jqXHR.responseText}`);
    }
  });

};

function getButtons(prevPageToken, nextPageToken, queryKeyword) {
  if (!prevPageToken) {
    return `<div class='button-container'>
                <button id='next-button' class='paging-button' data-token='${nextPageToken}' data-query='${queryKeyword}' onclick='nextPage();'>Next page</button>
            </div>`;
  } else {
    return `<div class='button-container'>
                <button id='prev-button' class='paging-button' data-token='${prevPageToken}' data-query='${queryKeyword}' onclick='prevPage();'>Prevoius page</button>
                <button id='next-button' class='paging-button' data-token='${nextPageToken}' data-query='${queryKeyword}' onclick='nextPage();'>Next page</button>
            </div>`;
  }
};

function getOutput(item) {
  let videoId = item.id.videoId;
  let title = item.snippet.title;
  let description = item.snippet.description;
  let thumUrl = item.snippet.thumbnails.high.url;
  let channelTitle = item.snippet.channelTitle;
  let videodate = item.snippet.publishedAt;

  // build output string
  let output = `<li>` +
                    `<div class= 'list-left'>` +
                      `<img src='${thumUrl}'>` +
                    `</div>` +
                    `<div class='list-right'>` +
                      `<h3><a data-fancybox class='fancybox fancybox.iframe' href='http://www.youtube.com/embed/${videoId}'>${title}</a></h3>` +
                      `<small>By<span class='cTitle'>${channelTitle}</span> on ${videodate} </small>` +
                      `<p>${description}</p>` +
                    `</div>` +
                `<li>`;

  return output;
};

function nextPage() {
  const nextButton = document.querySelector('#next-button');
  let token = nextButton.dataset.token;
  let query = nextButton.dataset.query;

  //clear
  results.innerHTML = '';
  btnGroup.innerHTML = '';

  callAPI(query, token);
};

function prevPage() {
  const prevButton = document.querySelector('#prev-button');
  let token = prevButton.dataset.token;
  let query = prevButton.dataset.query;

  //clear
  results.innerHTML = '';
  btnGroup.innerHTML = '';

  callAPI(query, token);

};

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
});

