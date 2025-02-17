package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Todo struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Body      string             `json:"body" bson:"body"`
	Completed bool               `json:"completed" bson:"completed"`
	Date      string             `json:"date" bson:"date"`
	Time      string             `json:"time,omitempty" bson:"time,omitempty"`
	CreatedAt string             `json:"createdAt" bson:"createdAt"`
	UpdatedAt string             `json:"updatedAt" bson:"updatedAt"`
}
