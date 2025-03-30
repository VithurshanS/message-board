const mongoose = require('mongoose');


async function connectDatabase(){
    await mongoose.connect(process.env.DB);
}


const replyschema = new mongoose.Schema({
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    delete_password: { type: String, required: true },
    reported: { type: Boolean, default: false }

})

const threadschema = new mongoose.Schema({
    board: { type: String, required: true },
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    bumped_on: { type: Date, default: Date.now },
    reported: { type: Boolean, default: false },
    delete_password: { type: String, required: true },
    replycount:{type: Number, default:0},
    replies: [replyschema]
});
async function createNewthread(board_r, text_r, delete_password_r){
    connectDatabase();
    const Thread = mongoose.model('Thread', threadschema);
    const newThread = new Thread({
        board: board_r,
        text: text_r,
        delete_password: delete_password_r,
        replies: []
    });
    await newThread.save();
    return newThread;
}
async function addreply(threadid_r,text_r,delete_password_r){
    connectDatabase();
    const Thread = mongoose.model('Thread', threadschema);
    const thread = await Thread.findById(threadid_r);
    if (!thread) {
        throw new Error('Thread not found');
    }
    const newReply = {
        text: text_r,
        delete_password: delete_password_r
    };
    thread.replies.push(newReply);
    thread.bumped_on = Date.now();
    await thread.save();
    return thread;
}
async function getThreads(board_r){
    connectDatabase();
    const Thread = mongoose.model('Thread', threadschema);
    const threads = await Thread.find({ board: board_r })
        .sort({ bumped_on: -1 })
        .limit(10)
        .select('-reported -delete_password')
        .lean();

    threads.forEach(thread => {
        thread.replies = thread.replies
            .slice(-3)
            .map(reply => ({
                _id: reply._id.toString(),
                text: reply.text,
                created_on: reply.created_on
            }));
    });
    threads.forEach(thread => {
        thread._id = thread._id.toString();
    });
    return threads;
}
async function deleteThread(threadid_r,delete_password_r) {
    connectDatabase();
    const Thread = mongoose.model('Thread',threadschema);
    const fthread = await Thread.findById(threadid_r);
    if(delete_password_r === fthread.delete_password) {
        await Thread.findByIdAndDelete(threadid_r);
        return { success: true };
    }else{
        return {success:false};
    }
}

async function deleteReply(threadid_r,replyid_r,delete_password_r){
    connectDatabase();
    const Thread = mongoose.model('Thread', threadschema);
    const thread = await Thread.findById(threadid_r);
    if (!thread) {
        throw new Error('Thread not found');
    }
    const reply = thread.replies.id(replyid_r);
    if (!reply) {
        throw new Error('Reply not found');
    }
    if (reply.delete_password === delete_password_r) {
        reply.text = '[deleted]';
        await thread.save();
        return { success: true };
    } else {
        return { success: false };
    }
}

async function getallreply(threadid_r){
    connectDatabase();
    const Thread = mongoose.model('Thread', threadschema);
    const thread = await Thread.findById(threadid_r)
        .select('-reported -delete_password')
        .lean();

    if (!thread) {
        throw new Error('Thread not found');
    }

    thread.replies = thread.replies.map(reply => ({
        _id: reply._id.toString(),
        text: reply.text,
        created_on: reply.created_on
    }));

    thread._id = thread._id.toString();
    return thread;
}
async function reportThread(threadid_r){
    connectDatabase();
    const Thread = mongoose.model('Thread', threadschema);
    const thread = await Thread.findById(threadid_r);
    if (!thread) {
        throw new Error('Thread not found');
    }
    thread.reported = true;
    await thread.save();
    return "success";
}
async function reportReply(threadid_r,replyid_r) {
    connectDatabase();
    const Thread = mongoose.model('Thread', threadschema);
    const thread = await Thread.findById(threadid_r);
    if (!thread) {
        throw new Error('Thread not found');
    }
    const reply = thread.replies.id(replyid_r);
    if (!reply) {
        throw new Error('Reply not found');
    }
    reply.reported = true;
    await thread.save();
    return "success";
    
}

module.exports = {
    createNewthread,
    connectDatabase,
    addreply,
    getThreads,
    deleteThread,
    deleteReply,
    getallreply,
    reportReply,
    reportThread
}; 

