package database

import (
	"context"
)

type Collection interface {
	Find(context.Context, any) (Cursor, error)
	InsertOne(context.Context, any) (any, error)
	UpdateOne(context.Context, any, any) (any, error)
	DeleteOne(context.Context, any) (any, error)
}

type Cursor interface {
	Close(context.Context) error
	All(context.Context, any) error
}
