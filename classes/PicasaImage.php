<?php
require_once('Image.interface.php');
class PicasaImage implements Image{
	public function __construct($arr){
		$this->image = $arr;
	}
	
	public function getUrl(){return (string)$this->image['image']['url'];}
	
	public function getWidth(){return (string)$this->image['image']['width'];}
	
	public function getHeight(){return (string)$this->image['image']['height'];}
	
	public function getSourceImageURL(){return (string)$this->image['src_img']['src'];}
	
	public function getDescription(){return $this->image['description'];}
	
	public function toArray(){
		$array = array(
			'url'=>$this->getUrl(),
			'width'=>$this->getWidth(),
			'height'=>$this->getHeight(),
			'source'=>$this->getSourceImageURL(),
			'description'=>$this->getDescription()
		);
		return $array;
	}
}
