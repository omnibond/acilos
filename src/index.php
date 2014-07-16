<?php
	require_once('auth.php');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Acilos</title>
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="pragma" content="no-cache">

	
	<link rel="stylesheet" href="app/resources/css/app.css">
	
	<meta charset="utf-8">
	<script src="d3.js"></script>
	<script src="http://d3js.org/d3.v3.js"></script>
	<script src="d3.layout.cloud.js"></script>

	<link rel="stylesheet" type="text/css" href="<?= $css ?>">

	<style>
		body {
		  font: 10px sans-serif;
		}
	</style>
	
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	<style type="text/css">
		html { height: 100% }
		body { height: 100%; margin: 0; padding: 0 }
		#map-canvas { height: 100% }
	</style>
	
	<script type="text/javascript"
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBsQiQTMwjNunO3SKZQ7hdz1s4uhTLkdMQ&sensor=true">
	</script>
	
</head>
<body>	
    <script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>

    	<!-- If you choose to remove this code, please consider donating at http://www.acilos.com -->
    	<script type="text/javascript" src="http://cf.cdn.inmobi.com/ad/inmobi.js"></script>
    	<div id="adSlot" style="display: none" innerHTML = '<div><img src="app/resources/img/AcilosStaticMob_1.png"></div>'>
    	<script type="text/javascript">
		    var inmobi_conf = {
				siteid: "fd745bb626664223981f201858473cd3",
				slot : "9", 
				test: false,
				autoRefresh: 20,
				onError : function(code) {
					if(code == "nfr" || !arguments || arguments == null || arguments == undefined || code == "504" || code == 504) {
						document.getElementById('adSlot').innerHTML = '<div><img src="app/resources/img/AcilosStaticMob_1.png"></div>';
					}
				}
		    };
		    _inmobi.getNewAd(document.getElementById('adSlot'), inmobi_conf);
		</script>
    	</div>
        

    <script data-dojo-config="async: 1, tlmSiblingOfDojo: 0, isDebug: 1, cacheBust: 1" src="dojo/dojo.js"></script>
    <script src="app/run.js"></script>
	<noscript>
		<p>
			This site requires JavaScript. For help enabling JavaScript in your browser,
			<a href="http://www.enable-javascript.com/" target="_blank">please follow these instructions</a>.
		</p>
	</noscript>
</body>
</html>