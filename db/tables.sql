create table users (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(256) not null
);
create table posts (
    id serial primary key,
    user_id integer not null,
    likes integer not null default 0,
    title varchar(255) not null,
    content text not null,
    timestamp timestamp default current_timestamp,
    foreign key (user_id) references users(id)
);

insert into users (name, email, password) values
('John Doe', 'john@doe.com', 'password');
insert into users (name, email, password) values
('Jane Smith', 'jane@smith.com', 'password');
insert into posts (user_id, likes, title, content) values
(1, 0, 'First Post', 'This is the content of the first post.');
insert into posts (user_id, likes, title, content) values
(2, 0, 'Second Post', 'This is the content of the second post.');