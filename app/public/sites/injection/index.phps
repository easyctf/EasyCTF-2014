<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>Injection</title>
</head>

<body>
	<form action="/sites/injection/index.php" method="post">
		<h1>Login to Access User Message</h1>
		<table>
			<tr>
				<td>Username</td>
				<td>
					<input type="text" name="username" autocomplete="off" autofocus>
				</td>
			</tr>
			<tr>
				<td>Password</td>
				<td>
					<input type="password" name="password" autocomplete="off">
				</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<input type="submit" name="submit" value="Login">
				</td>
			</tr>
		</table>
	</form>
	<div id="result">
				
	</div>
</body>

</html>