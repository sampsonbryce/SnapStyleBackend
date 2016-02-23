CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  email varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  username varchar(18)NOT NULL,
  password varchar(18) NOT NULL,
  date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)


