import FormInput from '@/components/FormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import FormData from 'form-data';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

const inter = Inter({ subsets: ['latin'] });

interface IValues {
  cid: string;
  mllhaq: string;
}

export default function Home({ html }: { html: string }) {
  const router = useRouter();

  const formMethods = useForm<IValues>({
    defaultValues: { cid: '', mllhaq: '' },
    resolver: yupResolver(
      yup.object({
        cid: yup.string().required(),
        mllhaq: yup.string().required(),
      })
    ),
  });

  const onSubmit = (values: IValues) => {
    console.log(values);
    router.push(`/?cid=${values?.cid}&mllhaq=${values?.mllhaq}`);
    setTimeout(() => {
      router.reload();
    }, 2000);
  };
  return (
    <>
      <div className="">
        <h2 className="">Find Madrasha based result</h2>

        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <FormInput name="cid" label="Enter cid" />
            <FormInput name="mllhaq" label="Enter madrasha Ilhaq no" />
            <div className="">
              After submitting the form it will first search the madrasha mobile
              number aftter that it will redirect you to another page which will
              take almost 2 minutes
            </div>
            <button type="submit">Submit</button>
          </form>
        </FormProvider>

        {html ? (
          <>
            <h1>Result is available here</h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </>
        ) : null}
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const searchMobile = async (cid: string, mllhaq: string) => {
    const res = await axios.post('https://wifaqedu.com/mobile-search', {
      cid,
      mllhaq,
    });
    return res.data;
  };

  const getResult = async (cid: string, mllhaq: string, mobile: string) => {
    const last2Digit = mobile?.slice(-2);
    const mobile_pre = mobile?.slice(0, -2);

    let form = new FormData();
    form.append('cid', cid);
    form.append('mllhaq', mllhaq);
    form.append('mobile', last2Digit);
    form.append('mobile_pre', mobile_pre);

    let text = '';

    try {
      const res = await axios.post('https://wifaqedu.com/madrasa-result', form);

      text += `Mobile number: ${mobile}<br/>`;
      text += res.data;
      return text;
    } catch (error) {
      console.dir(error);
      return '';
    }
  };

  let html = '';
  let mobileNumber = '';

  if (context?.query?.cid && context?.query?.mllhaq) {
    mobileNumber = await searchMobile(
      context?.query?.cid,
      context?.query?.mllhaq
    );
    mobileNumber = mobileNumber?.trim();
  }

  if (
    context?.query?.cid &&
    context?.query?.mllhaq &&
    mobileNumber?.trim()?.length
  ) {
    html = await getResult(
      context?.query?.cid,
      context?.query?.mllhaq,
      mobileNumber.trim()
    );
  }

  try {
    return {
      props: {
        html,
      },
    };
  } catch (error) {
    return {
      props: { html: '' },
    };
  }
};
