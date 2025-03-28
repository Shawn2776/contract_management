export default function TermsPage() {
  return (
    <div className="w-full">
      <header className="bg-secondary text-primary-foreground text-center p-10 items-center flex flex-col w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
          Terms and Conditions
        </h1>
        <p className="text-sm md:text-xl">
          Please read this agreement carefully before using this service.
        </p>
      </header>
      <main className="p-1 md:max-w-3xl mx-auto text-sm">
        <p>
          <em>Last Updated: 3/27/2025</em>
        </p>
        <section className="p-6 mx-auto font-bold flex flex-col gap-2">
          <p>PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING THIS SERVICE.</p>
          <p>
            BY USING THE SERVICE OR CLICKING “AGREE” CUSTOMER IS AGREEING TO BE
            BOUND BY THIS AGREEMENT. IF CUSTOMER IS AGREEING TO THIS AGREEMENT
            ON BEHALF OF OR FOR THE BENEFIT OF ITS EMPLOYER, THEN CUSTOMER
            REPRESENTS AND WARRANTS THAT IT HAS THE NECESSARY AUTHORITY TO AGREE
            TO THIS AGREEMENT ON ITS EMPLOYER'S BEHALF.
          </p>

          <p>
            This agreement is between [this website], and the customer agreeing
            to these terms (Customer).
          </p>
        </section>
        <section className="px-10 mx-auto flex flex-col gap-1 text-xs">
          <ul className="flex flex-col gap-2">
            <li>
              <span className="font-bold">1. SOFTWARE-AS-A-SERVICE:</span> This
              agreement provides Customer access to and usage of an Internet
              based software service as specified on an order and as further
              outlined at: finance.utalkto.com (Service).
            </li>
            <li className="flex flex-col gap-2">
              <span className="font-bold">2. USE OF SERVICE:</span>

              <ul className="flex flex-col gap-2 ml-5">
                <li>
                  <span className="font-bold">1. Customer Owned Data:</span> All
                  data and logos uploaded by Customer remains the property of
                  Customer, as between invoicely and Customer (Customer Data).
                  Customer grants invoicely the right to use, publicly display
                  and distribute the Customer Data for purposes of performing
                  under this agreement. See the invoicely FAQs
                  (invoicely.com/faq) regarding export of Customer Data.
                </li>
                <li>
                  <span className="font-bold">
                    2. Contractor Access and Usage:
                  </span>{" "}
                  Customer may allow its contractors to access the Service in
                  compliance with the terms of this agreement, which access must
                  be for the sole benefit of Customer. Customer is responsible
                  for the compliance with this agreement by its contractors.
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
