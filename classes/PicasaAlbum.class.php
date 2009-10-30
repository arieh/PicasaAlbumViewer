<?php
/*!
Copyright (c) 2009 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/
require_once('PicasaImage.php');

/**
 * this class is intended t extract a list of images from a given Picasa Album
 */
class PicasaAlbum implements Iterator{
	/**
	 * @var array a list of images
	 * @access private
	 */
	private $images = array();
	
	/**
	 * @var int position in the array. used for the Iterator interface implementaion
	 * @access private
	 */
	private $position = 0;
	
	/**
	 * @var mixed a holder of the current value. used for the Iterator interface implementaion
	 * @access private
	 */
	private $_current = null;
	
	/**
	 * @var array a list of allowed thumbnail sizes
	 * @access private
	 * @final
	 */
	static public $allowed_thumbsize = array('32c','32u','48c','48u','64c','64u','72u','72c','144c','144u','166c','166u');
	static public $allowed_maxsize = array(200, 288, 320, 400, 512, 576, 640, 720, 800);
	
	/**
	 * constructor
	 * @param string $user a valid google account user name
	 * @param string $album a Picasa Album id
	 * @param string $thumbsize the wanted thumbnail size
	 * @param string $maxsize the maximun allowed sise for the full-size images
	 * 
	 * @access public
	 */
	public function __construct($user,$album,$thumbsize='72c',$maxsize=720){
		if (!in_array($thumbsize,self::$allowed_thumbsize)) throw new PicasaAlbumException("The Requested Thumbsize $thumbsize isn't allowed");
		if (!in_array($maxsize,self::$allowed_maxsize)) throw new PicasaAlbumException("The Requeted Max-Imagesize $maxsize is invald");
		
		$raw_file = file_get_contents('http://picasaweb.google.com/data/feed/api/user/' .$user. '/albumid/' .$album. '?kind=photo&access=public&thumbsize=' .$thumbsize . '&imgmax=' .$maxsize);
		$this->xml = new SimpleXMLElement($raw_file);
		$this->xml->registerXPathNamespace('media', 'http://search.yahoo.com/mrss/');
		foreach($this->xml->entry as $feed){ 
			$group = $feed->xpath('./media:group/media:thumbnail');
			
			$image = $group[0]->attributes(); 
			$srcimg= $feed->content->attributes();
			
			$description = $feed->xpath('./media:group/media:description');
			
			if(is_string($description[0]) && str_word_count($description[0]) > 0){ 
				$img['description'] = $description[0]; 
			}else{
				$img['description'] = $feed->title;
			}
			$img['image']=$image;
			$img['src_img']=$srcimg;
			$img['description']=$description;
			$this->images[]=$img;
		}
	}

	/**
	 * fetch an mage from the stack
	 * 
	 * @return PicasaImage
	 * @access public
	 */
	public function getImage(){
		if ($this->valid())	return new PicasaImage($this->next());
		return false;
	}
	
	/**
	 * fetch the image list
	 * 
	 * @return array
	 * @access public
	 */
	 public function getImages(){
	 	$images = array();
	 	foreach ($this as $img) $images[]=$img;
	 	return $images;
	 }
	 
	 public function rewind(){$this->position=0;}
	 public function next(){
	 	if ($this->position>count($this->images)) $this->_current = false;
	 	$this->_current = $this->images[$this->position++];
	 	return $this->_current;
	 }
	 public function key(){return $this->position;}
	 public function valid(){return (bool)($this->position<count($this->images));}
	 public function count(){return (int)count($this->images);}
	 public function current(){return new PicasaImage($this->_current);}
	 
}

class PicasaAlbumException extends Exception{}