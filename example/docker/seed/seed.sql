CREATE TABLE `person` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`)) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4;

CREATE TABLE `pet` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`owner_id` int(11) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `owner_id` (`owner_id`),
	CONSTRAINT `pet_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `person` (`id`)) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4;

INSERT INTO `person` (`id`)
		VALUES(1);
INSERT INTO `pet` (`id`, `owner_id`)
		VALUES(1, 1);