const User = require('../Models/user');
const Post = require('../Models/post')


//user post 
async function postOne(req, res) {
    try {
        console.log(req.body.caption)
        console.log(req.file)
        const image = `http://localhost:4000/images/${req.file.filename}`
        let postdata = {
            image: image,
            userId: req.user._id,
            caption: req.body.caption
        }
        console.log(image)
        let data = await Post.create(postdata)
        res.status(200).json({ status: "Image uploaded successfully.", post: data })


    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: "ERROR" })
    }
};

//get post
async function getPost(req, res) {
    try {
       const getPost = await Post.find({userId:req.user._id,isDeleted:false})

        // const getPost = await User.find([
        //     {
        //         $match: { _id: req.user._id } 
        //     },
        //     {
        //         $lookup: {
        //             from: "posts", 
        //             localField: "_id", 
        //             foreignField: "userId",
        //             as: "postDetails"
        //         }
        //     },
        //     { $unwind: "$postDetails" }, 
        //     {
        //         $match: { "postDetails.isDeleted": { $ne: true } } 
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             username: 1,
        //             email: 1,
        //             postId: "$postDetails._id",  
        //             postImage: "$postDetails.filename",
        //             postLocation: "$postDetails.filelocation",
        //             userId: "$_id",
        //             postDetails: 1 
        //         }
        //     }
        // ]);
        
        const postCount = await Post.countDocuments({ userId: req.user._id,isDeleted: false });

        res.status(200).json({ status: "success", data: getPost,count:postCount });
    } catch (error) {
        console.error("Error in getPost function:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

//post delete
async function deletePost(req, res) {
    try {
        const postId = req.params.id; 
        const userId = req.user._id;

        const post = await Post.findOne({ _id: postId, userId: userId });

        if (!post) {
            return res.status(404).json({ status: "error", message: "Post not found or unauthorized" });
        }

        post.isDeleted = true;
        await post.save();

        return res.status(200).json({ status: "success", message: "Post marked as deleted" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

//get all post 
async function getAllPost(req, res) {
    try {
        const getPost = await Post.aggregate([
            {
                $lookup: {
                    from: "users", 
                    localField: "userId", 
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" }, 
            {
                $match: { "userDetails.isDeleted": { $ne: true } } 
            },
            {
                $project: {
                    _id:1,
                    image:1,
                    caption:1,
                    movie:1,
                    audio:1,
                    userId:1,
                    "userDetails.username":1,
                    "userDetails.email":1,
                    "userDetails.gender":1,
                    "userDetails.age":1       
                }
            }
        ]);
        
        const postCount = await Post.countDocuments({isDeleted: false });

        res.status(200).json({ status: "success", data: getPost,count:postCount });
    } catch (error) {
        console.error("Error in getPost function:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};


module.exports = {
    postOne,
    getPost,
    deletePost,
    getAllPost,
}