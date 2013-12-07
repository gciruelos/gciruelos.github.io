<?php

$title = 'Articles worth reading';


include 'header.php';
include 'sidebar.php';
echo '<div class="content">';
?>
<h1>Articles worth reading</h1>
<?php
include_once 'articles_list.php';

foreach($topics as $name=>$topic){
	echo '<h2>',$name,'</h2>';
	echo '<ul>';
	foreach ($topic as $article) {
		?>
		<li><a href="<?php echo $article['url'];?>" target="_blank"><?php echo $article['title'];?>
			<span class="comments"><?php echo $article['authors'];?><hr /><?php echo $article['comments'];?></span>
		</a></li>
		<?php
	}echo '</ul>';
}


echo '</div>';
include 'footer.php';
?>

