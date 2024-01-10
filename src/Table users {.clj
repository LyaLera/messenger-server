Table users {
  id UUID [primary key, default: `uuid_generate_v4()`, note: 'Primary key generated with UUID']
  name VARCHAR(100)
  age INT
  location VARCHAR(100)
}

Table conversations {
  id UUID [primary key, default: `uuid_generate_v4()`, note: 'Primary key generated with UUID']
  topic VARCHAR(255) [not null]
  created_at TIMESTAMP WITH TIME ZONE [default: `CURRENT_TIMESTAMP`]
  updated_at TIMESTAMP WITH TIME ZONE [default: `CURRENT_TIMESTAMP`]
}

Table messages {
  id UUID [primary key, default: `uuid_generate_v4()`, note: 'Primary key generated with UUID']
  content VARCHAR(255) [not null]
  created_at TIMESTAMP WITH TIME ZONE [default: `CURRENT_TIMESTAMP`]
  updated_at TIMESTAMP WITH TIME ZONE [default: `CURRENT_TIMESTAMP`]
  user_id UUID [not null, note: 'Foreign key references users(id)']
  conversation_id UUID [not null, note: 'Foreign key references conversations(id)']
  foreign key (user_id) references users(id)
  foreign key (conversation_id) references conversations(id)
}

Table participation_events {
  id UUID [primary key, default: `uuid_generate_v4()`, note: 'Primary key generated with UUID']
  joined_at TIMESTAMP WITH TIME ZONE [default: `CURRENT_TIMESTAMP`]
  participant BOOLEAN [not null]
  user_id UUID [not null, note: 'Foreign key references users(id)']
  conversation_id UUID [not null, note: 'Foreign key references conversations(id)']
  foreign key (user_id) references users(id)
  foreign key (conversation_id) references conversations(id)
}

Table likes {
  id UUID [primary key, default: `uuid_generate_v4()`, note: 'Primary key generated with UUID']
  liked_at TIMESTAMP WITH TIME ZONE [default: `CURRENT_TIMESTAMP`]
  user_id UUID [not null, note: 'Foreign key references users(id)']
  message_id UUID [not null, note: 'Foreign key references messages(id)']
  foreign key (user_id) references users(id)
  foreign key (message_id) references messages(id)
}
