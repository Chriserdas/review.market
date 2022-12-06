--------------- PRODUCT INFO--------------
DROP TABLE IF EXISTS category;
CREATE TABLE category(
    category_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(35),
    PRIMARY KEY (category_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS subcategory;
CREATE TABLE subcategory(
    subcategory_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id SMALLINT UNSIGNED NOT NULL,
    name VARCHAR(35),
    PRIMARY KEY (subcategory_id),
    CONSTRAINT fk_subcat_category FOREIGN KEY(category_id) REFERENCES category(category_id) ON DELETE cascade ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS product;
CREATE TABLE product(
    product_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT
    subcategory_id SMALLINT UNSIGNED NOT NULL,
    name VARCHAR(35),
    PRIMARY KEY (product_id),
    CONSTRAINT fk_prod_subcat FOREIGN KEY (subcategory_id) REFERENCES  subcategory(subcategory_id) ON DELETE cascade ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--------------- USER/ADMIN INFO--------------
DROP TABLE IF EXISTS administrator;
CREATE TABLE administrator(
    admin_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(35) NOT NULL,
    password CHAR(60) NOT NULL,
    PRIMARY KEY (admin_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS user;
CREATE TABLE user(
    user_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(35) NOT NULL,
    password CHAR(60) NOT NULL,
    email VARCHAR(50) NOT NULL,
    token INT UNSIGNED,
    create_date DATETIME NOT NULL,
    PRIMARY KEY (user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--------------- OFFER INFO--------------
DROP TABLE IF EXISTS offer;
CREATE TABLE offer(
    offer_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id SMALLINT UNSIGNED NOT NULL,
    price FLOAT NOT NULL,
    criteria fulfillment ENUM('YES', 'NO')
    create_date DATETIME NOT NULL,
    product_stock ENUM('YES', 'NO'),
    PRIMARY KEY (offer_id),
    CONSTRAINT fk_offer_product FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE cascade ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS likes_dislikes;
CREATE TABLE likes_dislikes(
    likes_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    dislikes_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT
    like_number INT UNSIGNED,
    dislikes_number INT UNSIGNED,
    user_id SMALLINT UNSIGNED NOT NULL,
    offer_id SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY(likes_id,dislikes_id)
    CONSTRAINT fk_like_offer FOREIGN KEY (offer_id) REFERENCES offer(offer_id) ON DELETE cascade ON UPDATE CASCADE,
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE cascade ON UPDATE CASCADE

)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
