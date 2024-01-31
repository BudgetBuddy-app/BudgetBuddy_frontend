<template>
    <div>
        <h1>Documentation</h1>
        <div>
            Welcome to the Budget Manager app "Budget Buddy"!
            I'm Diogo Ferreira, and this app was designed with my personal needs in mind so there are features that you
            might not use, and some that might be missing, but I am currenty working on adding more.

            for more info you can contact me at:
            <div>
                <div>
                    <NuxtLink to="https://www.github.com/diogo-febra-ferreira/">
                        <Icon name="mdi:linkedin" color="blue" />Github
                    </NuxtLink>
                </div>
                <div>
                    <NuxtLink to="https://www.linkedin.com/in/diogo-febra-ferreira/">
                        <Icon name="mdi:github" color="blue" />Linkedin
                    </NuxtLink>
                </div>
            </div>
        </div>

        <h1>Transactions</h1>
        <div>
            Transactions are considered withdrawals when the amount is ngative (e. -4, -2.12,-2938.23) and income when the
            amount is positive.
        </div>

        <h1>Accounts</h1>
        <div>
            Currently, a user cannot have many accounts with the same name to avoid confusion.
        </div>

        <h1>Admin endpoints</h1>
        <div>
            There are 4 backend endpoints designed to clean the database or manipulate it for testing and administration
            purposes:

            /drop-tables = will drop all the tables
            /create-tables = will create all the needed tbles and add an admin user with id 1
            /insert-dummy-data = will ad a few more users with accounts, transactions and categories, and will attribute the
            admin a few investments already filled out

            Buttons to interact with these are availabe to the admin in his user page.
        </div>

        <h1>CSV import</h1>
        <div>
            <b>Currently</b>, CSV import is static, andthe file must be in the following format:
            Recipient,amount,date,category,notes,account

            the first line should contain all the categories,followd by each transaction in a different line

            for example, a file could look like this:
            <div class="bg-blue-500">
                Recipient,amount,date,category,notes,account
                <br />Coffe Shop,-1.65,2023-12-01,socializing,coffee,VISA
                <br />Lidl,-3.66,2023-12-02,groceries,,VISA
                <br />ABC,-1.33,2023-12-02,,chocolate cake,cash
                <br />Lidl,-9.91,2023-12-03,groceries,,revolut
            </div>

            In the current implementation, categories/accounts will be created when they are not found in the database, in
            case they are found, they will be associated with the existing one.

            However, this might change in the future, as dynamic selection of lines in the CSV is planned.
        </div>

        <h1>Investments</h1>
        <div>
            An investment, when created, will only take:

            a ticker symbol (e. APPL, GOOGL, VUSA, VOO)
            Owned shares (which accepts fractional shares)
            Average purchase price

            From there, it will use a yahoo finance API to obtain the current value, more information about the holding, and
            calculate your profit/loss.
            For this you need to refresh the API with the respective button, do notice that yuo will need to create an
            account and get your own API key in this site, then add it to the .env file:
            https://rapidapi.com/apidojo/api/yh-finance/
            Also note that <b>refreshes per month are limited to 500</b>, after that, you'll have to wait another month, or
            pay.
            The obtained price of the stock might be inaccurate, innacuracies up to 0.1 have been noted, normally due to
            rounding errors.
        </div>

        <h1>Currency conversion</h1>
        <div>
            Currency conversion is done through the free API from:
            https://www.exchangerate-api.com/
            It does have a daily limit, but when reached, after around 20mins the IP block will be reset and you will be
            able to use it again
        </div>

        <h1>Development</h1>
        <div>
            For the frontend, these technologies were used:

            - Vue.js 3
            - Tailwind
            - Nuxt 3 (with Pinia and Nuxt UI)

            As for the backed, it was made with:

            - Node.js (Express.js)
            - Javascript libraries for csv imports (csv-parse), JSON web token use (jsonwebtoken), database connection
            (mysql2), among others.
            - MySQL
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'minimal'
})

</script>