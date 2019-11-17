
    document.getElementById("logo").onclick = ()=>{
        window.location.href = "/"
    };
    const display = $("#display");
    
  const retrieve = () => {
      fetch('/getPosts', {method: 'get'}).then((res) => {
          return res.json();
      }).then((data) => {
          displayPosts(data);
      });
  }
  retrieve();
  const displayPosts = (data) => {
      var count = 0;
      for(var key in data){
          if(data.hasOwnProperty(key)){
              count++;
              if(count > 4)
                break;
              display.append(postTemplate(data[key],key));
              showPostClickListner(data[key],key);
              
              
          }
          
      }
      
      
  }
  const postTemplate = (post,key) => {
      let text = post.text;
      if(post.text.length > 50){
          text = post.text.substring(0,51) + "...";
      }
      return `<li class="list-group-item" id="${key}">
                  <div class="row">
                      
                      <div class="col-4">
                          <img id="image_suggest" src="${post.imageurl}" class="rounded float-left" alt="...">   
                      </div>
                      <div class="col-8">
                          <div id="title">${post.title}</div>
                          <div class="row" id="text-row">
                              <div class="col-12">${text}</div> 
                          </div>
                          
                         
                      </div>     
                  </div>
              </li>`;

  }
  const showPostClickListner = (post, id) => {
      const clickable = document.getElementById(id);
      clickable.onclick = () => {
          console.log(post.title);
          window.location.href = `/posts?id=${id}`;
      }
      
      
  }
