<?php

interface Image {
	public function getUrl();
	
	public function getWidth();
	
	public function getHeight();
	
	public function getSourceImageURL();
	
	public function getDescription();
}