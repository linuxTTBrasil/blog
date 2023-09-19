--- 
--- 


const dbjs = {};
    
    {%for category in site.categories%}  
        dbjs["{{category[0]}}"] = [];
            {%for post in category[1]%}
                    dbjs["{{category[0]}}"].push({ data: "{{ post.date | date: '%Y-%m-%d' }}",titulo:"{{post.title}}", url:"{{post.url}}", descricao:"{{post.description}}"});
                {%endfor%}
        {%endfor%}


function createNewCategoryComponent(category){
      const categoryName = document.createElement("h1");
      categoryName.innerHTML = key;
      return categoryName
}

function addCategoriesToSelectCategoriesElement(id){
    let select = document.getElementById(id);
    for(column in dbjs){
        let option = document.createElement("option");
        option.text = column;
        option.value = column;
        select.add(option);
    }
}

function createNewPostListComponent(){
    
      const postLists = document.createElement("ul");
      postLists.style.paddingTop = "30px";
      postLists.style.paddingLeft = "60px";
      return postLists
}

function addNewPostToList(post, postLists){
        const postElement = document.createElement("li");
        postElement.classList.add("post");
        postElement.classList.add("filter");

        postElement.innerHTML = `<h3 class="post-title"><a href="${post.url}">${post.titulo}</a></h3><p class="message">${post.descricao}</p>`;
        postElement.style.backgroundColor = "inherit";
        postLists.appendChild(postElement);

}

function renderPostsByCategory(categoriaAtual = "", mainDivId = "main") {
  const divMain = document.getElementById(mainDivId);
  for (key in dbjs) {
    if (key === categoriaAtual || categoriaAtual === "") {
      const categoryName = createNewCategoryComponent(key);
      divMain.appendChild(categoryName);
      const postLists = createNewPostListComponent();
      divMain.appendChild(postLists);
      
      dbjs[key].forEach((value) => {
        addNewPostToList(value, postLists);
      });
    }
  }
}

function renderPostsBySearchParamQuery(mainDivId="main"){
    
    let param = new URL(window.location).searchParams.get("query");
    if(param == "" || param == null){
        return
    }
    let divMain = document.getElementById(mainDivId);
    const pastPosts = new Set();
        for(key in dbjs){
                dbjs[key].forEach((value)=>{
                    if(pastPosts.has(value.url)){
                        return
                    }
                    pastPosts.add(value.url);

                    if(value.titulo.toLowerCase().includes(param.toLowerCase()) || value.descricao.toLowerCase().includes(param.toLowerCase())){
                        let post = document.createElement("div");
                        post.classList.add("post");
                        post.classList.add("filter");
                        post.innerHTML = `<h1 class="post-title"><a href="${value.url}">${value.titulo}</a></h1><p class="message">${value.descricao}</p>`;
                        divMain.appendChild(post);
                    }
                })                 
            };
}     



