import {ObjectId} from 'mongodb';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import url from 'url';

export const getPosts = async(req, res) => {
    const parseUrl = url.parse(req.url)
    const query = parseUrl.query;

    try {
        let limit = query.limit;
        if(limit = undefined){ limit = 100 }

        const posts = await Post.find()
        .populate({
            path: "author",
            model: User,
            select: '_id name email photo'

        })
        .populate({
            path: "categories",
            model: Category,
            select: '_id name description'
        })
        .sort({ createdAt: 'desc' })
        .limit(limit)
        .exec();

        if(!posts){
            return res.status(400).json({
                success: false, message: "No post found"
            })

        }
        res.status(200).json({
            success: true, message: 'post created successfully', posts
        })
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}


export const createPost = async(req, res) => {
    const { title, body, categories, photo, author } = req.body;

    const toSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, '-');
    }
    let slug = toSlug(title);
    let image = null;
    if(photo?.length > 12){
        image = photo.substring(12);
    }

    try {
        if(!title || !slug || !body || !categories || !author){
            throw new Error("All fields are required");
        }

        const postExist = await Post.find({ title })
        if(!postExist){
            return res.status(400).json({
                success: false, message: "Post already exist"
            })
        }

        const post = new Post({
            title, slug, body, categories, photo: image, author
        });
        await post.save();
        res.status(200).json({
            success: true, message: "Post created successfully", post
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, message: error.message
         });    
    }
}


export const getPost = async(req, res) => {
    const slug = req.params.slug
    try {
       if(!slug){
        throw new Error('post ID required');
       }

       const post = await Post.findOne({slug});
       if(!post){
        return res.status(400).json({
            success: false, message: `No post record found`
        });
       }

       res.status(200).json({
        success: true, message: `${post?.title} post found`,
        data: post
    });

    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}


export const getSinglePost = async(req, res) => {
    const slug = req.params.slug
    try {
       if(!slug){
        throw new Error('post ID required');
       }

       const post = await Post.findOne({slug})
       .populate({
        path: "author",
        model: User,
        select: '_id name email photo'

    })
    .populate({
        path: "categories",
        model: Category,
        select: '_id name description'
    })
       if(!post){
        return res.status(400).json({
            success: false, message: `No post record found`
        });
       }

       res.status(200).json({
        success: true, message: `${post?.title} post found`,
        data: post
    });

    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}



export const updatePost = async(req, res) => {
    const post_slug = req.params.slug;   //return console.log("Response : ", req.body) ;
     
    const { title, body, categories, photo } = req.body;   
    const cate_id = new ObjectId(categories);  //return console.log("object : ", photo?.length) ;
    
    const toSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, '-');
    }
    let slug = toSlug(title);

    let image;    //return console.log("FORM DATA : ", req.body, slug); 
    if(photo?.length > 12){
        image = photo.substring(12);  //return console.log("Photo Picked : ", image);  
    }

    try {
        if(!title || !slug || !body || !categories){
            throw new Error('All fields are required');
        }
        let updatedPost;
        if(photo?.length > 12){
            updatedPost = await Post.findOneAndUpdate({ slug: post_slug }, { 
                title, slug, body, categories: cate_id, photo: image
             }, { new: true });
        }
        else{
            updatedPost = await Post.findOneAndUpdate({ slug: post_slug }, { 
                title, slug, body, categories: cate_id
             }, { new: true });
        }

        if(!updatedPost){
            return res.status(400).json({success: false, message: "Failed to update post!"});
        }

        await updatedPost.save();
        res.status(200).json({
            success: true, message: "Post updated successfully!", updatedPost
        });

    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}


export const deletePost = async(req, res) => {
        const slug = req.params.slug;
        if(!slug){
            throw new Error('Slug required');
           }
        
        try {
           

           const post = await Post.findOneAndDelete({ slug });
           if(!post){
                return res.status(400).json({
                    success: false, message: `Failed to delete post `
                });
           }
           
           res.status(200).json({
            success: true, message: ` post deleted successfully`,
            data: post
        });

        } catch (error) {
            res.status(400).json({
                success: false, message: error.message
            });
        }
}


export const likeUnlikePost = async(req, res) => {
        const { user_id, post_id } = req.body;
        const userId = new ObjectId(user_id);   ///console.log("PostId ===> ", postId);
        const postId = new ObjectId(post_id); 
    
    try {
        //ADD USER TO LIKE UNLIKED POST
        let addUserToPostLikes; let removeUserFromPostLikes; let addPostToUserLikes; let removePostFromUserLikes;

        const post = await Post.findById({ _id: postId });
        if (!post.likes.includes(user_id)) {
            addUserToPostLikes = await post.updateOne({ $push: { likes: { $each: [userId], $position: 0 } } });
        }
        else {
            removeUserFromPostLikes = await post.updateOne({ $pull: { likes: userId } });
        }


        //ADD REMOVE POST TO USER
        const user = await User.findById({ _id: userId });
        if (!user.likes.includes(post_id)) {
            addPostToUserLikes = await user.updateOne({ $push: { likes: { $each: [postId], $position: 0 } } });
        }
        else {
            removePostFromUserLikes = await user.updateOne({ $pull: { likes: postId } });
        }

        if (addUserToPostLikes && addPostToUserLikes) {
            res.status(200).json({ success: true, message: "Post was liked!" });
        }
        else if (removeUserFromPostLikes && removePostFromUserLikes) {
            res.status(200).json({
                success: true, message: 'Post was unliked !'
            });
        }

    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}


export const getLikedPosts = async(req, res) => {

    const parseUrl = url.parse(req.url, true);
    const user_id = req.params.user_id; 
    const query = parseUrl.query;
    try {
        let limit = query.limit; 
        if(limit === undefined) { limit = 100 }  //return console.log("Limit : ", limit);

        if (!user_id) {
            res.status(400).json({
                success: false,
                message: 'User id is required !'
            });
        }

        const user = await User.findOne({ _id: user_id }).select('-password')
            .populate({
                path: "likes",
                model: Post,
                select: "_id title slug categories body photo createdAt",
                populate: [
                    {
                        path: "author", // Populate the author field within children
                        model: User,
                        select: "_id name email photo", // Select only _id and username fields of the author
                    },
                    {
                        path: "categories", // Populate the author field within children
                        model: Category,
                        select: "_id name", // Select only _id and username fields of the author
                    },
                ],
            })
         // Populate the community field with _id and name
            // .populate({
            //     path: "likes", // Populate the post field
            //     populate: [
            //         {
            //             path: "author", // Populate the author field within children
            //             model: User,
            //             select: "_id", // Select only _id and username fields of the author
            //         },
            //     ],

            // })
        .sort({ createdAt: 'desc' })
        .limit(limit)
        .exec(); 

        if (user) {
            res.status(200).json({
                success: true,
                message: 'User liked posts found !',
                data: user
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Fail to fetch user liked posts !'
            });
        }

    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}



