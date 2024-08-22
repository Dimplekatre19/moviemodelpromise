const cl= console.log;
const movieContainer =document.getElementById("movieContainer");
const backDropId=document.getElementById("backDropId");
const movieModelId=document.getElementById("movieModelId");
const addMovieBtn=document.getElementById("addMovieBtn");
const movieCloseBtn=[...document.querySelectorAll('.movieClose')];
const MovieForm=document.getElementById("MovieForm");
const titlecontrol=document.getElementById("title");
const contentcontrol=document.getElementById("content");
const ratingcontrol=document.getElementById("rating");
const imageurlcontrol=document.getElementById("imageUrl");
const submitbtn=document.getElementById("submitbtn");
const updatebtn=document.getElementById("updatebtn");
const loader=document.getElementById("loader");

let BASE_URL="https://movie-model-5c5ae-default-rtdb.firebaseio.com";
let MOVIE_URL=`${BASE_URL}/movie.json`;

const sweetalert=(msg,icon)=>{
    Swal.fire({
          title:msg,
          timer:2500,
          icon:icon,
    })
}

// const objtoarr=(arr,obj)=>{
//     for(const key in obj){
//           arr.unshift({...obj[key],MovieId:key});
//     }
// }

const createmoviecards=(arr)=>{
      let result=``

      arr.forEach(movie => {
         
         result+=`
         <div class="col-md-4">
                <div class="card movieCard" id="${movie.movieId}">
                    <figure class="m-0">
                       <img src="${movie.imageUrl}">
                       <figcaption>
                          <h2 class="font-weigth-bold">${movie.title}</h2>
                          <strong>Rating:${movie.rating}</strong>
                          <p class="content">${movie.content}</p>
                          <div>
                            <button class="btn btn-sm nfx-btn bg-light" onclick="onMovieEdit(this)">Edit</button>
                            <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">Remove</button>
                          </div>
                       </figcaption>
                    </figure>
                </div>
            </div>
         `
         movieContainer.innerHTML=result;
      });
}

const makeapicall=(methodname,apiurl,msgbody)=>{
    msgbody=msgbody?JSON.stringify(msgbody):null;
    loader.classList.remove('d-none')
    return fetch(apiurl,{
         method:methodname,
         body:msgbody,
         headers:{
             token:"GET A JWT FROM LS"
         }
    })
    .then(res=>{
         return res.json()
    })
      
}

const fetchmovie=()=>{
       makeapicall("GET",MOVIE_URL)
        .then(data=>{
               let movieArr=[];
                for(const key in data){
                     movieArr.unshift({...data[key],movieId:key})
                }
               //cl(movieArr)
               createmoviecards(movieArr);
               sweetalert("MOVIE FETCHED SUCCESSFULLYY!!!","success");
        })
        .catch(err=>{
             sweetalert(err,"error")
        })
        .finally(()=>{
             loader.classList.add("d-none");
        })
}
fetchmovie();


const toggleModelBackdrop=()=>{
      backDropId.classList.toggle('visible');
      movieModelId.classList.toggle("visible");
      updatebtn.classList.add("d-none");
      submitbtn.classList.remove("d-none")

      MovieForm.reset()
}

const onmovieadd=(eve)=>{
     eve.preventDefault();
     let newmovie={
       title:titlecontrol.value,
       content:contentcontrol.value,
       imageUrl:imageurlcontrol.value,
       rating:ratingcontrol.value
     }
    // cl(newmovie)
     makeapicall("POST",MOVIE_URL,newmovie)
      .then(res=>{
        // cl(res);
        let div=document.createElement("div");
        div.className="col-md-4"
        newmovie.movieId=res.name;
        div.innerHTML=`
                   <div class="card movieCard" id="${newmovie.movieId}">
                    <figure class="m-0">
                       <img src="${newmovie.imageUrl}">
                       <figcaption>
                          <h2 class="font-weigth-bold">${newmovie.title}</h2>
                          <strong>Rating:${newmovie.rating}</strong>
                          <p class="content">${newmovie.content}</p>
                          <div>
                            <button class="btn btn-sm nfx-btn bg-light" onclick="onMovieEdit(this)">Edit</button>
                            <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">Remove</button>
                          </div>
                       </figcaption>
                    </figure>
                </div>
        
        `
       movieContainer.prepend(div);
       sweetalert("MOVIE ADDED SUCCESSFULLYY","success")
      })
      .catch(err=>{
         sweetalert(err,"error")
      })
      .finally(()=>{
          loader.classList.add("d-none")
          toggleModelBackdrop()
      })
}

const onMovieEdit=(ele)=>{
    toggleModelBackdrop()
      let editId=ele.closest(".card").id;
      localStorage.setItem("editId",editId)
      let EDIT_URL=`${BASE_URL}/movie/${editId}.json`

      makeapicall("GET",EDIT_URL)
       .then(res=>{
         cl(res);
         titlecontrol.value=res.title;
         contentcontrol.value=res.content;
         ratingcontrol.value=res.rating;
         imageurlcontrol.value=res.imageUrl;
         updatebtn.classList.remove('d-none');
         submitbtn.classList.add("d-none");
       })
       .catch(err=>{
        sweetalert(err,"error")
       })
       .finally(()=>{
           loader.classList.add('d-none')
       })
}
const onmovieupdate=()=>{
      let updateId=localStorage.getItem("editId");
      let UPDATE_URL=`${BASE_URL}/movie/${updateId}.json`
       let updatedobj={
          title:titlecontrol.value ,
          content:contentcontrol.value,
          rating:ratingcontrol.value,
          imageUrl:imageurlcontrol.value
       }
       cl(updatedobj);
       makeapicall("PATCH",UPDATE_URL,updatedobj)
       .then(res=>{
            cl(res);
            let getmoviecard=document.getElementById(updateId);
            getmoviecard.innerHTML=`
           <figure class="m-0">
                       <img src="${res.imageUrl}">
                       <figcaption>
                          <h2 class="font-weigth-bold">${res.title}</h2>
                          <strong>Rating:${res.rating}</strong>
                          <p class="content">${res.content}</p>
                          <div>
                            <button class="btn btn-sm nfx-btn bg-light" onclick="onMovieEdit(this)">Edit</button>
                            <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">Remove</button>
                          </div>
                       </figcaption>
                    </figure>
            
            `
           toggleModelBackdrop()
           sweetalert("MOVIE UPDATED SUCCESSFULLYY!!","success");
       })
       .catch(err=>{
         sweetalert(err,"error")
       })
       .finally(()=>{
          loader.classList.add('d-none')
       })
}

const onMovieRemove=(ele)=>{
 
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgba(0, 0, 0, 0.8)",
        cancelButtonColor: "rgb(229,9,20)",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
         
           let removeId=ele.closest(".card").id;
           let REMOVE_URL=`${BASE_URL}/movie/${removeId}.json`
           makeapicall("DELETE",REMOVE_URL)
             .then(res=>{
                ele.closest(".card").parentElement.remove();
                sweetalert("MOVIE REMOVED SUCCESSFULLLYY!!","success")
             })
            .catch(err=>{
                sweetalert(err,"error")
              })
            .finally(()=>{
                    loader.classList.add("d-none");
              })
        }
      });
      
}


movieCloseBtn.forEach(btn=>{
      btn.addEventListener("click",toggleModelBackdrop)
})

addMovieBtn.addEventListener("click",toggleModelBackdrop);
MovieForm.addEventListener("submit",onmovieadd);
updatebtn.addEventListener("click",onmovieupdate);