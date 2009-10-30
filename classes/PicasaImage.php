<?php
require_once('Image.interface.php');
class PicasaImage implements Image{
	public function __construct($arr){
		$this->image = $arr;
	}
	
	public function getUrl(){return $this->image['image']['url'];}
	
	public function getWidth(){return $this->image['image']['width'];}
	
	public function getHeight(){return $this->image['image']['height'];}
	
	public function getSourceImageURL(){return $this->image['src_img']['src'];}
	
	public function getDescription(){return $this->image['description'];}
}
