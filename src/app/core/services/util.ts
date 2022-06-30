import {Observable} from 'rxjs';


export function createHttpObservable(url:string):Observable<any> {
  return new Observable(observer => {

    const controller = new AbortController();
    const signal = controller.signal;

    fetch('https://resto-back.jasoncooke.net'+url, {signal})
      // @ts-ignore
      .then(response => {

        if (response.ok) {
          return response.json();
        }
        else {
          observer.error('Request failed with status code: ' + response.status);
        }
      })
      .then(body => {

        observer.next(body);

        observer.complete();

      })
      .catch(err => {

        observer.error(err);

      });

    return () => controller.abort()


  });
}
