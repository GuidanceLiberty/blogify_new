import { isValidObjectId } from "mongoose";
import { Category } from "../models/Category.js";
import { ObjectId} from 'mongodb';

export const getCategories = async(req, res) => {
    try {
            const categories = await Category.find();
            if(categories){
                return res.status(200).json({
                    success: true, message: "category found", data: categories
            })
                
            }
    
            return res.status(200).json({
                success: false, message: "No category found"
        })
            
        } catch (error) {
            return res.status(400).json({
                success: false, message: error.message
            })
        }
    }

    export const createCategory = async(req, res) => {
        const {name, description} = req.body;
        if(!name || !description){
            throw new Error("All fields are required!");
        }


        try {
           const categoryExist = await Category.findOne({name});
           if(categoryExist){
               res.status(400).json({
                   success: false, message: 'Category already exist'
               });
           }
   
   
           const category = new Category({name, description});
           await category.save();
   
           res.status(201).json({
               success: true, message: `${name} category created successfully`,
               data: category
           }); 
        } catch (error) {
            res.status(400).json({success: false, message: error.message});
        }
    }


    export const getCategory = async(req, res) => {
        const category_id = new ObjectId(req.params.category_id)
        try {
           if(!category_id){
            throw new Error('Category ID required');
           }

           const category = await Category.findById({_id: category_id});
           if(!category){
            return res.status(400).json({
                success: false, message: `No category record found`
            });
           }

           res.status(200).json({
            success: true, message: `${category?.name} category found`,
            data: category
        });

        } catch (error) {
            res.status(400).json({
                success: false, message: error.message
            });
        }
    }

    export const updateCategory = async(req, res) => {
        const category_id = new ObjectId(req.params.category_id);
        if(!category_id){
            throw new Error('Category ID required');
           }
        const { name, description} = req.body;
        try {
           if(!name || !description){
            throw new Error('All fields required');
           }

           const category = await Category.findOneAndUpdate({_id: category_id}, 
            {name, description}, {new: true}
           );
           if(!category){
            return res.status(400).json({
                success: false, message: `Failed to update category record`
            });
           }
           await category.save();

           res.status(200).json({
            success: true, message: ` category updated successfully`,
            data: category
        });

        } catch (error) {
            res.status(400).json({
                success: false, message: error.message
            });
        }
    }


    export const deleteCategory = async(req, res) => {
        const category_id = new ObjectId(req.params.category_id);
        if(!category_id){
            throw new Error('Category ID required');
           }
        
        try {
           

           const category = await Category.findOneAndDelete({_id: category_id} 
           
           );
           if(!category){
            return res.status(400).json({
                success: false, message: `Failed to delete category record`
            });
           }
           

           res.status(200).json({
            success: true, message: ` category deleted successfully`,
            data: category
        });

        } catch (error) {
            res.status(400).json({
                success: false, message: error.message
            });
        }
    }

