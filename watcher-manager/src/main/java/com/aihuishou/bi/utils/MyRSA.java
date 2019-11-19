package com.aihuishou.bi.utils;

import com.google.common.io.BaseEncoding;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

public class MyRSA {
    private static final Logger logger = LoggerFactory.getLogger(MyRSA.class);

    /**
     * 加密
     *
     * @param key   公钥 or 私钥
     * @param plain 原明文
     * @return 密文 base64编码
     */
    public static String encrypt(Key key, String plain) {
        try {
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return encode(cipher.doFinal(plain.getBytes("UTF8")));
        } catch (Exception e) {
            logger.error("", e);
            return null;
        }
    }

    /**
     * 解密
     *
     * @param key
     * @param crypt 密文 base64编码
     * @return 明文
     */
    public static String decrypt(Key key, String crypt) {
        try {
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipher.init(Cipher.DECRYPT_MODE, key);
            return new String(cipher.doFinal(decode(crypt)), "UTF8");
        } catch (Exception e) {
            logger.error("", e);
            return null;
        }
    }

    /**
     * 签名
     *
     * @param key   私钥
     * @param plain 原文
     * @return 签名
     */
    public static String sign(PrivateKey key, String plain) {
        try {
            Signature signature = Signature.getInstance("SHA1WithRSA");
            signature.initSign(key);
            signature.update(plain.getBytes("UTF-8"));
            String signed = encode(signature.sign());
            return signed;
        } catch (Exception e) {
            logger.error("", e);
            return null;
        }
    }

    /**
     * @param key
     * @param plain 原文
     * @param sign  base64编码
     * @return
     */
    public static Boolean verifySign(PublicKey key, String plain, String sign) {
        try {
            Signature signature = Signature.getInstance("SHA1WithRSA");
            signature.initVerify(key);
            signature.update(plain.getBytes("UTF-8"));
            return signature.verify(decode(sign));
        } catch (Exception e) {
            logger.error("", e);
            return null;
        }
    }

    public static PrivateKey loadPrivateKey(File keyFile) {
        try {
            return loadPrivateKey(org.apache.commons.io.FileUtils.readFileToString(keyFile));
        } catch (IOException e) {
            logger.error("", e);
            return null;
        }
    }

    /**
     * 从秘钥文件中加载私钥（PKCS8格式）
     *
     * @param keyData 私钥
     * @return 是否成功
     * @throws Exception
     */
    public static PrivateKey loadPrivateKey(String keyData) {
        try (BufferedReader br = new BufferedReader(new StringReader(keyData))) {
            String readLine = null;
            StringBuilder sb = new StringBuilder();
            while ((readLine = br.readLine()) != null) {
                if (readLine.charAt(0) == '-') {
                    continue;
                } else {
                    sb.append(readLine);
                }
            }
            byte[] buffer = decode(sb.toString());
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(buffer);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return keyFactory.generatePrivate(keySpec);
        } catch (Exception e) {
            logger.error("", e);
            return null;
        }
    }


    public static PublicKey loadPublicKey(File keyFile) {
        try {
            return loadPublicKey(org.apache.commons.io.FileUtils.readFileToString(keyFile));
        } catch (IOException e) {
            logger.error("", e);
            return null;
        }
    }

    /**
     * 从文件中加载公钥
     *
     * @param keyData 公钥文件
     * @return 是否成功
     * @throws Exception
     */
    public static PublicKey loadPublicKey(String keyData) {
        try (BufferedReader br = new BufferedReader(new StringReader(keyData))) {
            String readLine = null;
            StringBuilder sb = new StringBuilder();
            while ((readLine = br.readLine()) != null) {
                if (readLine.charAt(0) == '-') {
                    continue;
                } else {
                    sb.append(readLine);
                }
            }
            byte[] buffer = decode(sb.toString());
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(buffer);
            return keyFactory.generatePublic(keySpec);
        } catch (Exception e) {
            logger.error("", e);
            return null;
        }
    }

    private static byte[] decode(String str) {
        return BaseEncoding.base64().decode(str);
    }

    private static String encode(byte[] bs) {
        return BaseEncoding.base64().encode(bs);
    }

    public static void main(String[] args) {
        PrivateKey key = MyRSA.loadPrivateKey(new File("D:\\workspace\\IntelliJ\\refact\\watcher-manager\\watcher-manager\\target\\classes\\rsa\\ahs_pkcs8.pem"));
        System.out.println(encrypt(key, Long.toString(System.currentTimeMillis())));
    }
}