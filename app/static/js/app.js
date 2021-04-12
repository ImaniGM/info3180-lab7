/* Add your Application JavaScript */


const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }
};



//uploadForm VueJs component 
const Upload_Form = {
    name: 'Upload_Form', 
    template: `
    <div>
    <h2> {{displayTitle}} </h2>
    <form @submit.prevent="uploadPhoto" method="post" enctype="multipart/form-data" id="uploadForm">

        <div class="alert" id="showAlert">
            {{alertText}}
            <ul>
                <li v-for = "showError in errors"> {{showError}} </li>
            </ul>
        </div>         
        <div class="form-group">
            <label for ="description" class="form-control-label">Description</label>
            <textarea rows="4" cols="40" class="form-control" name="description"></textarea>
        </div>

        <div class="form-group">
            <label for="photo">Upload Photo</label>
            <input type="file" class="form-control" name="photo"  @change="onFileChange" accept="image/*" />
        </div>
        
        <button type="submit"  class="btn btn-primary">Submit</button>
    </form>
    </div>
    `,
    data() {
        return {
            displayTitle: 'Upload Form',
            alertText: '',
            errors: []
        }
    },
    methods: {
        uploadPhoto() {
            let self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            let displayAlert = document.getElementById('showAlert');

            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            }).then(function(response) {
                return response.json();
            }).then(function(jsonResponse) {
                // display a success message or error/s, depending
                displayAlert.style.display = "block";
                console.log(jsonResponse.status);
                if (jsonResponse.status == 200) {
                    self.alertText = jsonResponse.message;
                    // alert(self.alertText);
                    self.errors = []
                    displayAlert.classList.add("alert-success");
                    displayAlert.classList.remove("alert-danger");
                } else if (jsonResponse.status == 500) {
                    self.errors = jsonResponse.errors;
                    self.alertText = "";
                    displayAlert.classList.add('alert-danger');
                    displayAlert.classList.remove('alert-success');
                }
            }).catch(function(error) {
                console.log(error);
                self.errors = error;
            });


        }

    },
    mounted() {
        document.getElementById("showAlert").style.display = "none";
    }

    };
    

// Instantiate our main Vue Instance
const app = Vue.createApp({
    components: {
        'Home': Home,
        'upload-form': Upload_Form
    },
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/upload">Upload Photo <span class="sr-only"></span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", name: Home, component: Home },
    // Put other routes here

    // This is a catch all route in case none of the above matches
    { path: "/upload", name: Upload_Form, component: Upload_Form },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');