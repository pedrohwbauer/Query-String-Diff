<?php
if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
  $uri = 'https://';
} else {
  $uri = 'http://';
}
$uri .= $_SERVER['HTTP_HOST'];

?>

<!doctype html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

  <link id="style"rel="stylesheet" href="style.css">

  <title>Query String Diff</title>
</head>

<body>
  <div class="container">
    <div class="mt-2 mb-2">
      <h1>Query String Diff</h1>
      <p>
        This tools compares two query strings in the form of "key=value", separated by "&amp;"
      </p>
    </div>
    <div class="mt-5" id="compare-form">
      <div id="alert" class="alert alert-danger" role="alert" style="display: none"></div>
      <div class="row">
        <div class="col-5 form-group">
          <textarea class="form-control" placeholder="First query string" name="query-string-1" rows="10"></textarea>
        </div>
        <div class="col-2 text-center">
          <button id="compare" class="btn btn-primary">Compare</button>
        </div>
        <div class="col-5 form-group">
          <textarea class="form-control" placeholder="Second query string" name="query-string-2" rows="10"></textarea>
        </div>
      </div>
    </div>
    <div id="diff" style="display: none">
      <div class="row align-items-end">
        <div class="col-6 mb-3 text-left">
          <div><i class="row-sign alert-light"></i>Parameters with equal values</div>
          <div><i class="row-sign alert-danger"></i>Parameters with different values</div>
          <div><i class="row-sign alert-success"></i>Different parameters</div>
        </div>
        <div class="col-6 mb-2 text-right">
          <button id="new-diff" class="btn btn-primary">Perform new diff</button>
        </div>
      </div>
      <div class="row">
        <div id="table-1" class="col-6">
          <div class="gutter">
            <pre><code></code></pre>
          </div>
          <div class="compare-col">
            <pre><code></code></pre>
          </div>
        </div>
        <div id="table-2" class="col-6">
          <div class="gutter">
            <pre><code></code></pre>
          </div>
          <div class="compare-col">
            <pre><code></code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  <script src="./compare.js"></script>
</body>

</html>