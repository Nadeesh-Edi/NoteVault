import { Realm, RealmProvider, useRealm, useQuery } from '@realm/react'

class Note extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    title!: string;
    content!: string;

    static generate(title: string, content: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            title,
            content
        };
    }

    static schema = {
        name: 'Note',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            title: 'string',
            content: 'string'
        }
    }
}

export default Note;