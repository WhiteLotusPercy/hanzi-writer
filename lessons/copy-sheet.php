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
				<textarea class="js-char chars-input" rows="4" cols="50">
                </textarea>
			<button type="submit">更新</button>
            <button class="js-print">打印</button>
        </form>

        <div id="target-sheet">
        </div>

		<!-- <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> -->
		<script type="application/javascript" src="../js/hanzi-writer.js"></script>
		<script type="application/javascript" src="wrapper.js"></script>
        <script type="application/javascript" src="copy-sheet.js"></script>
        <script type="application/javascript" src="printing.js"></script>
	</body>
</html>
