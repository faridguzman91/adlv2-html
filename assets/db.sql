CREATE TABLE IF NOT EXISTS `log` (
`session_id` varchar(100) NOT NULL DEFAULT '',
`document_id` int(11),
`log_key` varchar(100) NOT NULL DEFAULT '',
`log_value` varchar(255) NOT NULL DEFAULT '',
`log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;