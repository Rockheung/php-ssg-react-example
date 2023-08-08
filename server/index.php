<?php

$package_json = file_get_contents('../package.json');
$package = json_decode($package_json, true);
$package_name = $package['name'];
$prerendered_html = file_get_contents("dist/$package_name.html");

echo <<<EOT
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>PHP Test: $package_name</title>
</head>
<body>$prerendered_html</body>
</html>
EOT;
