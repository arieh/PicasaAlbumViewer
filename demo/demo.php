<?php
ob_start();
require_once('../classes/PicasaAlbum.class.php');

$user = 'arieh.glazer';
$aID = '5346936535986674945';

$thumbsize = isset($_GET['thumb'])? $_GET['thumb'] : '64c';
$thumbsize = in_array($thumbsize,PicasaAlbum::$allowed_thumbsize) ? $thumbsize : '64c';

$album = new PicasaAlbum($user,$aID,$thumbsize);

?>
<!DOCTYPE html 
     PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>
	<title>thumbs</title>
	<meta http-equiv="Content-Type" content="text/html; charset='UTF-8'" />
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
	<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.8.0r4/build/reset/reset-min.css" /> 
	
	<link rel="stylesheet" type="text/css" href="../thumbslides_<?php echo substr($thumbsize,0,2);?>.css" />
	<link rel="stylesheet" type="text/css" href="smoothbox.css" />
	<style type='text/css'>
	fieldset legend{font-size:1.5em;font-weight:bold;}
	dt{font-weight:bold;}
	dd{margin-left:10px;}	
	</style>
</head>
<body>
<fieldset>
	<legend>Examples</legend>
	<dl>
		<dt>Croped</dt>
			<dd><a href='demo.php?thumb=32c'>Thumbs Size: 32px</a></dd>
			<dd><a href='demo.php?thumb=48c'>Thumbs Size: 48px</a></dd>
			<dd><a href='demo.php?thumb=64c'>Thumbs Size: 64px</a></dd>
			<dd><a href='demo.php?thumb=72c'>Thumbs Size: 72px</a></dd>
		<dt>Uncroped</dt>
			<dd><a href='demo.php?thumb=32u'>Thumbs Size: 32px</a></dd>
			<dd><a href='demo.php?thumb=48u'>Thumbs Size: 48px</a></dd>
			<dd><a href='demo.php?thumb=64u'>Thumbs Size: 64px</a></dd>
			<dd><a href='demo.php?thumb=72u'>Thumbs Size: 72px</a></dd>
	</dl>
</fieldset>
	
<ul id='album_list'>
<?php while ($image = $album->getImage()):?>
	<li><a href='<?php echo $image->getSourceImageUrl();?>' class='smoothbox'>
		<img src='<?php echo $image->getUrl();?>' 
			height='<?php echo $image->getHeight();?>' 
			width='<?php echo $image->getWidth();?>' 
			alt='album image'
			/></a></li>
<?php endwhile; ?>
</ul>
<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/mootools/1.2.1/mootools-yui-compressed.js'></script>
<script type='text/javascript' src='../thumbslides.js'></script>
<script type='text/javascript' src='smoothbox.js'></script>
<script type='text/javascript'>
document.addEvent('domready',function(){
	var slides = new ThumbSlides($('album_list'),{thumbSize:<?php echo substr($thumbsize,0,2);?>});
	TB_init()
})
</script>
</body>
</html>
<?php ob_flush();?>