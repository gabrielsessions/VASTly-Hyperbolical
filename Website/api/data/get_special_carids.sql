--CREATE INDEX caridindex ON sensor_data USING HASH (carid);

SELECT DISTINCT carid FROM sensor_data
WHERE (
	(SELECT MAX(sd.timestamp)
	FROM sensor_data sd
	WHERE sd.carid=sensor_data.carid)
	- 
	(SELECT MIN(sd.timestamp)
	FROM sensor_data sd
	WHERE sd.carid=sensor_data.carid)
) > '30 days'
ORDER BY carid