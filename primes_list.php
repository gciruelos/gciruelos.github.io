<?php

$title = 'All the primes';

include 'header.php';
include 'sidebar.php';
echo '<div class="content">';

?>
<script>
var starting = 0;

console.log(starting);

function isPrime(n) {
    if (n == 1 || n == 0) return false;
    if (n == 2) return true;
    for (var div = 2; div < Math.sqrt(n)+1; div++) {
        if (n % div == 0) return false;
    }
    return true;
}

function writePrimes() {
    var primes = [];
    document.getElementById("primeList").innerhtml = "";
    for (var n = starting; n < starting + 1000; n++) {
        if (isPrime(n)) {
            primes.push(n);
        }
    }
    starting += 1000;
    return primes.join(" ");
}
</script>
<h1>All the prime numbers</h1>
<div id="primeList" onClick="this.innerHTML = writePrimes();" >Click here to generate next 1000 primes...</div>
<?php

echo '</div>';
include 'footer.php';
?>
