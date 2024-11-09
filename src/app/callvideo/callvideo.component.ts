import { Component, ElementRef, ViewChild } from '@angular/core';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// get token
function generateToken(tokenServerUrl: string, userID: string) {
  // Obtain the token interface provided by the App Server
  return fetch(
    `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
    {
      method: 'GET',
    }
  ).then((res) => res.json());
}

function randomID(len: number) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

@Component({
  selector: 'app-callvideo',
  templateUrl: './callvideo.component.html',
  styleUrl: './callvideo.component.scss'
})
export class CallvideoComponent {
  @ViewChild('root')
  root!: ElementRef;

  ngAfterViewInit() {
    // Lấy dữ liệu từ localStorage
    const chatAppDataString = localStorage.getItem('chatApp');

    // Chuyển đổi chuỗi JSON thành đối tượng
    const chatAppData = chatAppDataString ? JSON.parse(chatAppDataString) : {};
    const knowAs = chatAppData.knowAs || '';
    const urlParams = getUrlParams();
    const roomID = urlParams.get('roomID') || randomID(5);
    const userID = randomID(5);
    const userName = knowAs;
    // generate token
    console.log(roomID)
    generateToken('https://nextjs-token.vercel.app/api', userID).then((res) => {
      const token = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        1484647939,
        res.token,
        roomID,
        userID,
        userName
      );
      // create instance object from token
      const zp = ZegoUIKitPrebuilt.create(token);

      console.log(
        'this.root.nativeElement',
        this.root.nativeElement.clientWidth
      );
      // start the call
      zp.joinRoom({
        container: this.root.nativeElement,
        // sharedLinks: [
        //   {
        //     name: 'Personal link',
        //     url:
        //       window.location.origin +
        //       window.location.pathname +
        //       '?roomID=' +
        //       roomID,
        //   },
        // ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
    });
  }
}
