import { h } from "vue";
import { NotificationArgsProps } from "ant-design-vue/lib/notification";
import { notification } from "ant-design-vue";
export declare type Type = "open" | "success" | "info" | "error" | "warning";

const renderCustomNotification = (type: Type, message: any) => {
  return h(
    "div",
    {
      class: "customNotify",
      style: {
        "min-width": "552px",
      },
    },
    [
      message,
      h("div", {
        style: {
          "min-width": "552px",
        },
        class: { bar: true, [type]: true },
      }),
    ]
  );
};

export default function Notification(
  type: Type,
  options: NotificationArgsProps
) {
  return notification[type]({
    ...options,
    message: renderCustomNotification(type, options.message),
  });
}
