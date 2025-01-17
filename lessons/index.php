<?php
$chinese_char = (isset($_GET['char']) ? $_GET['char'] : '仁' ) ;
?>

<!DOCTYPE html>
<html lang="en-us">
	<head>
		<meta charset="utf-8">
		<title>学写字</title>
		<!-- <link href='http://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'> -->
		<link rel="stylesheet" href="styles.css" />
        <link rel="stylesheet" href="styles-extra.css" />
		<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
    </head>
	<body>

		<h1 class="title">学写字</h1>
		<form class="js-char-form char-form">
			<label>
				<input type="text" class="js-char char-input" size="1" maxlength="1" value="仁" />
			</label>
			<button type="submit">更新</button>
			<button class="js-quiz">试写</button>
		</form>
		<div class="actions">
            <div class="js-toggle"></div>
			<div class="js-toggle-hint"></div>
            <div class="js-animate"></div>
		</div>

        <div id="target-main">
            <svg id="target">
            </svg>
        </div>


        <br>
        <div id="target-stroke">
        </div>

		<!-- <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> -->
		<script type="application/javascript" src="../js/hanzi-writer.js"></script>
		<script type="application/javascript" src="wrapper.js"></script>
        <script type="application/javascript" src="single.js"></script>
	</body>
</html>
