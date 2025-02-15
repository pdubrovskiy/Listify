package database

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	client         *mongo.Client
	TodoCollection Collection
)

type MongoCollection struct {
	coll *mongo.Collection
}

func (mc *MongoCollection) Find(ctx context.Context, filter any) (Cursor, error) {
	cursor, err := mc.coll.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	return &MongoCursor{cursor: cursor}, nil
}

func (mc *MongoCollection) InsertOne(ctx context.Context, document any) (any, error) {
	result, err := mc.coll.InsertOne(ctx, document)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, nil
}

func (mc *MongoCollection) UpdateOne(ctx context.Context, filter any, update any) (any, error) {
	result, err := mc.coll.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (mc *MongoCollection) DeleteOne(ctx context.Context, filter any) (any, error) {
	result, err := mc.coll.DeleteOne(ctx, filter)
	if err != nil {
		return nil, err
	}
	return result, nil
}

type MongoCursor struct {
	cursor *mongo.Cursor
}

func (mc *MongoCursor) Close(ctx context.Context) error {
	return mc.cursor.Close(ctx)
}

func (mc *MongoCursor) All(ctx context.Context, result any) error {
	return mc.cursor.All(ctx, result)
}

func ConnectDB() {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI environment variable is not set")
	}

	clientOptions := options.Client().ApplyURI(uri)
	var err error
	client, err = mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	collection := client.Database("listify_db").Collection("todos")
	TodoCollection = &MongoCollection{coll: collection}
	log.Println("Connected to MongoDB!")
}

func DisconnectDB() {
	if client != nil {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Fatal(err)
		}
	}
}
