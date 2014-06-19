<?php
$name = $_POST['name'];
$idea = $_POST['idea'];
$number_of_ideas = $_POST['number_of_ideas'];
$rating = $_POST['rating'];
$email = $_POST['email'];

$to = "will@vil.es";
$subject = "Project Req: $projectname";
$body = "Name: $name \n\n Idea: $idea \n\n Number of Ideas: $number_of_ideas \n\n Rating: $rating";
$from = $email;

$headers = "From:" . $from;
mail($to,$subject,$body,$headers);
echo "sent";
?>