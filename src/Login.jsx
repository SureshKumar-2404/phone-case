import { useEffect, useState } from 'react';
import styles from './styles.module.css'; // CSS module

const redirectToShopifyAuth = (e, shop) => {
    console.log("je;dasfdafdasf")
    if (shop?.length) {
        const authUrl = `http://localhost:3000/platforms/Shopify/auth?shop=${shop}`;
        window.location.href = authUrl;
    }
    return;
};

const Login = () => {

    const [shopName, setShopName] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const shop = urlParams.get('shop');

        console.log("code ", code)
        console.log("shop ", shop)
        if (code && shop) {
            fetch(`http://localhost:/platforms/Shopify/code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, shop }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data?.error) {
                        alert('Temporary - Could Not Authorize You')
                    } else {
                        document.cookie = `jwt=${data.token}; path=/;`; // not sure if we'll use this yet, but nyrih has this on linkedin
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('shop', shop);
                        console.log(data, 'is our data', shop, 'is our shop ')
                        window.location.href = "https://admin.shopify.com/store/" + shop?.split(".myshopify.com")[0] + "/apps/" + "caseus-1";
                    }
                }).catch((err) => {
                    console.log(err, ' is our error ')
                })
        }
    }, [window?.location]);

    const handleInputChange = (event) => {
        setShopName(event.target.value);
    };

    return (
        <div className={styles.inputWrapper}>
            <input
                type="text"
                placeholder="Enter your shop name"
                value={shopName}
                onChange={handleInputChange}
                className={styles.inputField}
            />
            <span className={styles.domainSuffix}>.myshopify.com</span>
            <button onClick={(e) => redirectToShopifyAuth(e, shopName)}>Install on Shopify</button>
        </div>
    );

};

export default Login;