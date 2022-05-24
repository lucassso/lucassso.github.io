-- TODO: the queries dont work we gotta fix it -_-


CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(15),
  `password` varchar(64),
  `role` varchar(5),
  `progress_id` int,
  PRIMARY KEY (`user_id`)
);
-- ROLE values:
-- NON average user (default value)
-- ADMIN has access panel instead of game panel

-- USERNAME can be a max of 15 characters, rest is cut-off
-- HASH is 64 characters

-- INSERT INTO QUERY IF ADMIN ACCOUNT IS DELETED

-- INSERT INTO `user`
--   (`username`, `password`, `role`, `progress_id`)
-- VALUES
-- ('admin123', '$2y$10$UivhHqvn0JVBQFJ2qYBAL.NMQgpEqD/7i61.2V/BopidTYbbMXzF2', 'admin', NULL);

-- admin view: takes you to control panel where all records of all tables
-- are listed with a textfield to input SQL queries

--ADMIN login info
--USERNAME: admin123
--PASSWORD: password123

CREATE TABLE IF NOT EXISTS `obstacle` (
  `obstacle_id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `health` int,
  `atk_stat` int
);

INSERT INTO obstacle
  (`name`, `health`, `atk_stat`)
VALUES
  ('mirror', 1, 5), -- you can pick up for free from Old Man at start of game
  -- pov you copied legend of zelda L?
  ('potato', 50, 5), -- if you look for food you may find this (20%)
  ('bartender', 150, 15), -- Only if drunk; miniboss 1
  ('guy with a gun', 200, 20), -- find while in forest
  ('bee nest', 200, 20),
  ('minion', 200, 20),
  -- Will be mulitple minions before you reach final boss
  ('rogue AI', 1000, 75)
;

CREATE TABLE IF NOT EXISTS `progress` (
  `progress_id` int NOT NULL AUTO_INCREMENT,
  `health` int,
  `money` int,
  `obstacle_id` int,
  PRIMARY KEY(`progress_id`)
);

CREATE TABLE IF NOT EXISTS `inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `progress_id` int,
  `item_id` int,
  PRIMARY KEY (`inventory_id`)
);


CREATE TABLE IF NOT EXISTS `item` (
	`item_id` int NOT NULL AUTO_INCREMENT,
	`name` text,
  `use` text,
  `stat` int,
	PRIMARY KEY (`item_id`)
);
-- USE values:
-- HEAL may be used any time to increase player hp
-- WEAPON may be used during battle and has an atk stat

-- STAT values:
-- depends on the USE value, but for USE HEAL it depicts hp gain stat
-- for USE SPECIAL it is NULL and for USE WEAPON it depicts atk stat

INSERT INTO item
	(`name`, `use`, `stat`)
VALUES
  ('bandages', 'heal', 30),
  ('crusty sword', 'weapon', 25),
  ('dusty sword', 'weapon', 40),
  ('musty sword', 'weapon', 60),
  ('grenade', 'weapon', 50),
  ('small potion of healing', 'heal', 20),
  ('standard potion of healing', 'heal', 40),
  ('sizeable potion of healing', 'heal', 70),
  ('large potion of healing', 'heal', 100)

;

CREATE TABLE IF NOT EXISTS `shop` (
  `stock_id` int NOT NULL AUTO_INCREMENT,
  `item_id` int,
  `quantity` int,
  PRIMARY KEY (`stock_id`)
);

INSERT INTO shop
  (`item_id`, `quantity`)
VALUES
  (1, 1),
  (5, 10)
;
