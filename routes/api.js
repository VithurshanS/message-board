'use strict';
const { text } = require("body-parser");
const { createNewthread,addreply,getThreads,deleteThread,deleteReply,getallreply,reportReply,reportThread } = require('../models/databse');

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
      if(req.body.text===null){
        //console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
        res.status(200).json({"text":"Couldn't post new thread"});
      }else{
        //const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`,{method:'POST',headers:{'Content-Type':"application/json"},body:JSON.stringify({
        //       "text":req.body.text,
        //       "delete_password":req.body.delete_password
        // })})
        const thread = await createNewthread(req.params.board,req.body.text,req.body.delete_password);
        
        if(thread._id != null){
          res.redirect(`/b/${req.params.board}`)
            console.log("hida", thread._id.toString());

        }else{
          res.status(500).type(text).send("none");
        }

      }
      
      
    }
  ).get(async function(req,res){
        //const threadrep = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`);
        //console.log(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`);4
        //const boo = req.params.board;
        //console.log(boo)
        const threads = await getThreads(req.params.board);
        //console.log(threads);
        //const bod = await threadrep.json();
        //console.log(bod);
        res.json(threads); 
        

    }
  ).delete(async function(req,res){
        //const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`,{method:'DELETE',headers:{'Content-Type':"application/json"},body:JSON.stringify({board:req.params.board,thread_id:req.body.thread_id,delete_password:req.body.delete_password})});
        //const body = await ress.json();
        //const boo = await ress.text();
        const {success} = await deleteThread(req.body.thread_id,req.body.delete_password);
        console.log(success);
        //console.log(boo);
        if(success){
          res.status(200).send("success");
        }else{
          res.status(200).send("incorrect password");
        }


  }).put(async function(req,res){
    const s = await reportThread(req.body.thread_id);
    res.send(s);

  });
    
  app.route('/api/replies/:board').post(
    async function(req,res){
      //console.log("nanaan")
      //console.log(req.params.board,"summaaaa");
      if(req.body.text===null){
        //console.log("///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////");
        res.status(200).json({"text":"Couldn't post new thread"});
      }else{
        // const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board} `,{method:'POST',headers:{'Content-Type':"application/json"},body:JSON.stringify({
        //       "board":req.params.board,
        //       "thread_id":req.body.thread_id,
        //       "text":req.body.text,
        //       "delete_password":req.body.delete_password
        // })})
        const thread = await addreply(req.body.thread_id,req.body.text,req.body.delete_password)
        //console.log(req.params.board)
        if(thread._id != null){
          res.send("success")

        }else{
          res.status(500).type(text).send("none");
        }

      }    
    }
  ).get(async function(req,res){
    //const rep = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board}?thread_id=${req.query.thread_id}`);
    //console.log(`https://anonymous-message-board.freecodecamp.rocks/api/threads/${req.params.board}`);4
    //const boo = req.params.board;
    const thread = await getallreply(req.query.thread_id);
    //console.log(boo)
    if(thread._id != null){
      //const bod = await rep.json();
      //console.log(bod);
      //console.log("wwswsw",bod.replies);
      thread.replycount = thread.replies.length;
      res.json(thread); 

    }else{
      res.send("invalid");
    }
    
    

    }
  ).put(async function(req,res){
    // const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board}`,{method:'PUT',headers:{'Content-Type':"application/json"},body:JSON.stringify({board:req.params.board,report_id:req.body.thread_id,reply_id:req.body.reply_id})});
    // const bod = await ress.text();
    const s = await reportReply(req.body.thread_id,req.body.reply_id);
    res.send(s);

  }).delete(async function(req,res){
    //console.log(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board}`+"Testt");
    //const ress = await fetch(`https://anonymous-message-board.freecodecamp.rocks/api/replies/${req.params.board}`,{method:'DELETE',headers:{'Content-Type':"application/json"},body:JSON.stringify({thread_id:req.body.thread_id,reply_id:req.body.reply_id,delete_password:req.body.delete_password})});
    //const body = await ress.json();
    //const boo = await ress.text();
    const {success} = await deleteReply(req.body.thread_id,req.body.reply_id,req.body.delete_password);
    if(success){
      res.send("success");
    }else{
      res.send("incorrect password");
    }


});

};
