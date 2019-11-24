// Axios Globals
axios.defaults.headers.common[
  "X-Auth-Token"
] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

function getTodos() {
  //   axios({
  //     method: "get",
  //     url: "https://jsonplaceholder.typicode.com/todos",
  //     params: {
  //       _limit: 5
  //     }
  //   })
  //     .then(res => showOutput(res))
  //     .catch(err => console.error(err));
  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      params: { _limit: 5 },
      timeout: 5000 /* miliseconds */
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

function addTodos() {
  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      title: "New Todo",
      completed: false
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

function updateTodos() {
  axios
    .patch(`https://jsonplaceholder.typicode.com/todos/1`, {
      title: "Updated Todo",
      completed: true
    })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

function removeTodos() {
  axios
    .delete(`https://jsonplaceholder.typicode.com/todos/1`)
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

function getData() {
  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/todos", {
        params: { _limit: 5 }
      }),
      axios.get("https://jsonplaceholder.typicode.com/posts", {
        params: { _limit: 5 }
      })
    ])
    .then(axios.spread((todos, posts) => showOutput(posts)))
    .catch(err => console.error(err));
}

function customHeaders() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "sometoken"
    }
  };

  axios
    .post(
      "https://jsonplaceholder.typicode.com/todos",
      {
        title: "New Todo",
        completed: false
      },
      config
    )
    .then(res => showOutput(res))
    .catch(err => console.error(err));
}

function transformResponse() {
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "hello world"
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  };

  axios(options).then(res => showOutput(res));
}

function errorHandling() {
  axios
    .get("https://jsonplaceholder.typicode.com/todoss", {
      //   validateStatus: status => {
      //     return status < 500; // Reject only if status is > or equal to 500
      //   }
    })
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        // Server responded with a status other than 200
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        // Request was made but no response
        console.error(err.request);
      } else {
        console.error(err.message);
      }
    });
}

function cancelToken() {
  const source = axios.CancelToken.source();

  axios
    .get("https://jsonplaceholder.typicode.com/todos?_limit=5", {
      cancelToken: source.token
    })
    .then(res => showOutput(res))
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log("Request canceled", thrown.message);
      }
    });

  if (true) {
    source.cancel("Request canceled");
  }
}

// Interceptin requests & responses
axios.interceptors.request.use(
  config => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

// Axios Instnce
const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

// axiosInstance.get("/comments?_limit=5").then(res => showOutput(res));

function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodos);
document.getElementById("update").addEventListener("click", updateTodos);
document.getElementById("delete").addEventListener("click", removeTodos);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
