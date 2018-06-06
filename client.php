<?php
/**
 * Created by PhpStorm.
 * User: hu
 * Date: 6/6/18
 * Time: 1:52 PM
 */
require_once __DIR__ . '/vendor/autoload.php';

define('API_HOST', 'https://api.liniopay.com/');

class client
{
    /**
     * @param $method
     * @param $url
     * @param bool $data
     * @param array $headers
     * @return mixed|\Psr\Http\Message\ResponseInterface
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function CallAPI($method, $url, $data = false, $headers = [])
    {
        $client = new \GuzzleHttp\Client();

        return $client->request($method, $url, [
            'headers' => $headers,
            'body'    => $data,
        ]);
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function handle()
    {
        $post = json_decode(file_get_contents('php://input', 'r'), true);
        $timestamp = time();
        $method = $post['method'] ? : '';
        $url = $post['api'] ? : '';
        $data = $post['body'] ? : '';
        $accessKey = $post['accessKey'] ? : '';
        $sharedSecretKey = $post['sharedSecretKey'] ? : '';

        $hash = hash_hmac('sha256',  $data . $timestamp, $sharedSecretKey, false);
        $auth = sprintf("LP-HMAC-SHA256 access_key=%s;ts=%d;signature=%s",
            $accessKey, $timestamp, $hash);
        $headers = [
            'Authorization' => $auth
        ];
        header('content-type: text/json');
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");
        $res = $this->CallAPI($method, API_HOST . $url, $data, $headers);
        echo $res->getBody()->getContents();
    }
}

try {
    (new client())->handle();
} catch (\GuzzleHttp\Exception\GuzzleException $e) {
    echo $e->getMessage();
}
