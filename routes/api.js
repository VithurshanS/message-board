'use strict';

const { text } = require("body-parser");

function finder(lists,id){
  lists.forEach(element => {
    if (element._id === id){
      return element;
    }
  });
}

module.exports = function (app) {
  
  app.route('/api/threads/:board').post(
    async function(req,res){
      //console.log("nanaan")
      //console.log(req.params.board,"summaaaa");
      if(req.body.text===null){
        //console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
        res.status(200).json({"text":"Couldn't post new thread"});
      }else{
        const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`,{method:'POST',headers:{'Content-Type':"application/json"},body:JSON.stringify({
              "text":req.body.text,
              "delete_password":req.body.delete_password
        })})
        //console.log(req.params.board)
        if(ress.ok){
          res.redirect(`/b/${req.params.board}`)

        }else{
          res.status(500).type(text).send("none");
        }

      }
      
      
    }
  ).get(async function(req,res){
        const threadrep = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`);
        //console.log(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`);4
        //const boo = req.params.board;
        //console.log(boo)
        const bod = await threadrep.json();
        //console.log(bod);
        res.json(bod); 
        

    }
  ).delete(async function(req,res){
        const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`,{method:'DELETE',headers:{'Content-Type':"application/json"},body:JSON.stringify({board:req.params.board,thread_id:req.body.thread_id,delete_password:req.body.delete_password})});
        //const body = await ress.json();
        const boo = await ress.text();
        //console.log(boo);
        if(boo === "success"){
          res.status(200).send("success");
        }else{
          res.status(200).send("incorrect password");
        }


  }).put(async function(req,res){
    const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`,{method:'PUT',headers:{'Content-Type':"application/json"},body:JSON.stringify({board:req.params.board,thread_id:req.body.thread_id})});
    const bod = await ress.text();
    res.send("success");

  });
    
  app.route('/api/replies/:board').post(
    async function(req,res){
      //console.log("nanaan")
      //console.log(req.params.board,"summaaaa");
      if(req.body.text===null){
        //console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
        res.status(200).json({"text":"Couldn't post new thread"});
      }else{
        const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board} `,{method:'POST',headers:{'Content-Type':"application/json"},body:JSON.stringify({
              "board":req.params.board,
              "thread_id":req.body.thread_id,
              "text":req.body.text,
              "delete_password":req.body.delete_password
        })})
        //console.log(req.params.board)
        if(ress.ok){
          res.send("success")

        }else{
          res.status(500).type(text).send("none");
        }

      }    
    }
  ).get(async function(req,res){
    const rep = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board}?thread_id=${req.query.thread_id}`);
    //console.log(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`);4
    //const boo = req.params.board;
    //console.log(boo)
    if(rep.ok){
      const bod = await rep.json();
      //console.log(bod);
      //console.log("wwswsw",bod.replies);
      res.json(bod); 

    }else{
      res.send("invalid");
    }
    
    

    }
  ).put(async function(req,res){
    const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board}`,{method:'PUT',headers:{'Content-Type':"application/json"},body:JSON.stringify({board:req.params.board,thread_id:req.body.thread_id,reply_id:req.body.reply_id})});
    const bod = await ress.text();
    res.send("success");

  }).delete(async function(req,res){
    //console.log(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board}`+"Testt");
    const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board}`,{method:'DELETE',headers:{'Content-Type':"application/json"},body:JSON.stringify({thread_id:req.body.thread_id,reply_id:req.body.reply_id,delete_password:req.body.delete_password})});
    //const body = await ress.json();
    const boo = await ress.text();
    if(boo.trim() === 'incorrect password'){
      res.send("incorrect password");
    }else{
      res.send("success");
    }


});

};
